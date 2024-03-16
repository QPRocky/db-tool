using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController() : ControllerBase
{
    [HttpGet("TestConnection")]
    public async Task<IActionResult> TestConnection()
    {       
        try
        {
            if (!Request.Headers.TryGetValue("ConnectionString", out var connectionString))
            {
                return BadRequest("Missing connectionString header");
            }

            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SELECT 1", connection);
            await command.ExecuteScalarAsync();

            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }
}