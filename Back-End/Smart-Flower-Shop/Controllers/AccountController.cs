using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Smart_Flower_Shop.DTO;
using Smart_Flower_Shop.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        //**************************************************************

        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration config;

        // عملتها علشان ياخد بيانات من الاببستنج    
        public AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration config)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.config = config;
        }


        //**************************************************************

        //Create  Account for New User (Register)


        [HttpPost ("UserRegister")]

        public async Task<IActionResult> Register(ResgisterUserDto userDto)  
                                                                             

        {
            if (ModelState.IsValid)
            {
                ApplicationUser uSER = new ApplicationUser();                                             
                uSER.UserName = userDto.FullName; 
                uSER.PhoneNumber = userDto.phone;
                uSER.Address = userDto.Address;
                uSER.Email = userDto.Email;
               
               IdentityResult result = await userManager.CreateAsync(uSER, userDto.password);
               
                
                if (result.Succeeded)
                {
                    var roleResult = await EnsureRoleAndAddUserAsync(uSER, "User");
                    if (!roleResult.Succeeded)
                    {
                        await userManager.DeleteAsync(uSER);
                        return BadRequest(roleResult.Errors);
                    }

                    return Ok("Account Created ");

                }
                return BadRequest(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpPost("AdminRegister")]
        public async Task<IActionResult> AdminRegister(ResgisterUserDto userDto)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser uSER = new ApplicationUser(); 
                uSER.UserName = userDto.FullName;
                uSER.PhoneNumber = userDto.phone;
                uSER.Address = userDto.Address;
                uSER.Email = userDto.Email;

                IdentityResult result = await userManager.CreateAsync(uSER, userDto.password);
                if (result.Succeeded)
                {
                    var roleResult = await EnsureRoleAndAddUserAsync(uSER, "Admin");
                    if (!roleResult.Succeeded)
                    {
                        await userManager.DeleteAsync(uSER);
                        return BadRequest(roleResult.Errors);
                    }
                 
                    return Ok(new { message = "Account Created" });


                }
                return BadRequest(result.Errors);
            }

            return BadRequest(ModelState);
        }

        private async Task<IdentityResult> EnsureRoleAndAddUserAsync(ApplicationUser user, string roleName)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var createRoleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!createRoleResult.Succeeded)
                {
                    return createRoleResult;
                }
            }

            return await userManager.AddToRoleAsync(user, roleName);
        }



        [HttpPost("AdminLogin")] //api /Account/login 
        public async Task<IActionResult> LOGIN(LOGINDTO loginUser) 
        {
            if (ModelState.IsValid == true)
            { // check  - create token

                ApplicationUser application = await FindUserByNameOrEmailAsync(loginUser.UserName); // كده جبنا قيمه هنا

                if (application != null) 

                { 

                    
                    bool found = await userManager.CheckPasswordAsync(application, loginUser.Password);

                    if (found) 
                    {

                        // Get Role
                        var roles = await userManager.GetRolesAsync(application);

                       
                        bool isAdmin = roles.Contains("Admin");
                        if (!isAdmin)
                        {
                            return Unauthorized(new { message = "You are not authorized as an Admin" });
                        }


                        // Claims Token
                        var claims = new List<Claim>(); 
                        claims.Add(new Claim(ClaimTypes.Name, application.UserName));
                        claims.Add(new Claim(ClaimTypes.NameIdentifier, application.Id));
                        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

                       

                        foreach (var itemRole in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, itemRole));
                        }
                        SecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"]));

                        SigningCredentials signing = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        JwtSecurityToken MyToken = new JwtSecurityToken(
                            issuer: config["JWT:ValidIssuer"],
                            audience: config["JWT:ValidAudience"],
                            claims: claims,
                           expires: DateTime.Now.AddHours(1),
                           signingCredentials: signing
                            );

                        return Ok(new
                        {
                            Token = new JwtSecurityTokenHandler().WriteToken(MyToken),
                            expiration = MyToken.ValidTo,
                            UserName = application.UserName
                        });



                    }
                    return Unauthorized();
                }
                return Unauthorized(); 
            }
            return Unauthorized(new { message = "Invalid username or password" });
           

        }






        [HttpPost("UserLogin")] //api /Account/login 
        public async Task<IActionResult> UserLOGIN(LOGINDTO loginUser) 
        {
            if (ModelState.IsValid == true)
            { // check  - create token

                ApplicationUser application = await FindUserByNameOrEmailAsync(loginUser.UserName); 

                if (application != null) 

                { 
                    bool found = await userManager.CheckPasswordAsync(application, loginUser.Password);

                    if (found) 
                    {

                        // Get Role
                        var roles = await userManager.GetRolesAsync(application);

                        
                        bool isUser = roles.Contains("User");
                        if (!isUser)
                        {
                            return Unauthorized(new { message = "You are not authorized as an User" });
                        }
                        // Claims Token
                        var claims = new List<Claim>(); 
                        claims.Add(new Claim(ClaimTypes.Name, application.UserName));
                        claims.Add(new Claim(ClaimTypes.NameIdentifier, application.Id));
                        claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));

                       
                        foreach (var itemRole in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, itemRole));
                        }
                        SecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"]));

                        SigningCredentials signing = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        JwtSecurityToken MyToken = new JwtSecurityToken(
                            issuer: config["JWT:ValidIssuer"],
                            audience: config["JWT:ValidAudience"],
                            claims: claims,
                           expires: DateTime.Now.AddHours(1),
                           signingCredentials: signing
                            );

                        return Ok(new
                        {
                            Token = new JwtSecurityTokenHandler().WriteToken(MyToken),
                            expiration = MyToken.ValidTo,
                             UserName = application.UserName
                        });



                    }
                    return Unauthorized();
                }
                return Unauthorized(); 
            }
            return Unauthorized(new { message = "Invalid username or password" });
          

        }


      



        private async Task<ApplicationUser?> FindUserByNameOrEmailAsync(string userNameOrEmail)
        {
            var user = await userManager.FindByNameAsync(userNameOrEmail);
            if (user != null)
            {
                return user;
            }

            return await userManager.FindByEmailAsync(userNameOrEmail);
        }

        // Get count of normal users (non-admins)
        [HttpGet("GetUsersCount")]
        public async Task<IActionResult> GetUsersCount()
        {
           
            var users = await userManager.Users.ToListAsync();

            
            var normalUsersCount = 0;
            foreach (var user in users)
            {
                
                var roles = await userManager.GetRolesAsync(user);

            
                if (!roles.Contains("Admin"))
                {
                    normalUsersCount++;
                }
            }

            return Ok(new { NumberOfUsers = normalUsersCount });
        }









    }
}
