namespace Api.Models;

public class ForeignKeyDetails
{
    public string ParentTableName { get; set; }
    public string ParentColumn { get; set; } 
    public string ReferenceTableName { get; set; }
    public string ReferenceColumn { get; set; }
}
