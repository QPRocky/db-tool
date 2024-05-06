namespace DbToolApi.Dtos;

public class ForeignKeySearchDetails
{
    public string ReferenceTableName { get; set; }
    public string ReferenceColumnName { get; set; }
    public object  ForeignKey { get; set; }
}
