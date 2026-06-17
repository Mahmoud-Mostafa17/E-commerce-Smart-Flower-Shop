using Microsoft.AspNetCore.Mvc;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly IConfiguration configuration;

        public AIController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            this.httpClientFactory = httpClientFactory;
            this.configuration = configuration;
        }

        [HttpPost("Predict")]
        public async Task<IActionResult> Predict([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Please upload an image file."
                });
            }

            if (file.ContentType == null || !file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Please upload a valid image file."
                });
            }

            var aiBaseUrl = configuration["AI:BaseUrl"] ?? "http://localhost:8000";
            var predictUrl = $"{aiBaseUrl.TrimEnd('/')}/predict";

            using var form = new MultipartFormDataContent();
            await using var fileStream = file.OpenReadStream();
            using var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
            form.Add(fileContent, "file", file.FileName);

            var client = httpClientFactory.CreateClient();

            try
            {
                using var response = await client.PostAsync(predictUrl, form);
                var responseBody = await response.Content.ReadAsStringAsync();
                var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/json";

                return new ContentResult
                {
                    StatusCode = (int)response.StatusCode,
                    Content = responseBody,
                    ContentType = contentType
                };
            }
            catch (HttpRequestException)
            {
                return StatusCode(StatusCodes.Status502BadGateway, new
                {
                    success = false,
                    error = "AI service is not running. Start the Python backend on http://localhost:8000."
                });
            }
            catch (TaskCanceledException)
            {
                return StatusCode(StatusCodes.Status504GatewayTimeout, new
                {
                    success = false,
                    error = "AI service did not respond in time."
                });
            }
        }
    }
}
