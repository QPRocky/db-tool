namespace Api.Dtos;

public class ForeignKeySearchDetails
{
    public string ReferenceTableName { get; set; }
    public string ReferenceColumnName { get; set; }
    public int ForeignKey { get; set; }
}
