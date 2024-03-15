using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController(EfDbContext dbContext) : ControllerBase
{
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<IActionResult> GetWeatherForecast()
    {
        var res = await dbContext.Transactions.ToListAsync();
        return Ok(res);
    }
}