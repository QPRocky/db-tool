namespace DbToolApi.Models;

public class ChangeRowDetails
{
    public List<Dictionary<string, string>> Rows { get; set; } = [];
}

public class ChangeResults
{
    public Dictionary<string, ChangeRowDetails> Inserted { get; set; } = [];
    public Dictionary<string, ChangeRowDetails> Updated { get; set; } = [];
    public Dictionary<string, ChangeRowDetails> Deleted { get; set; } = [];
}
