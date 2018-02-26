<%@ WebHandler Language="C#" Class="bot" %>

using System.IO;
using System.Web;
using System.Text.RegularExpressions;

public class bot : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string url = context.Request.QueryString["url"];
        string title = context.Request.QueryString["title"];
        if (!string.IsNullOrEmpty(url))
        {
            url = url.Replace('|', '/').Replace('~', ':');

        }

        string pathDir = HttpContext.Current.Server.MapPath("~/data/");

        string data = "";
        using (StreamReader stream = new StreamReader(context.Request.InputStream))
        {
            data = stream.ReadToEnd();
            data = HttpUtility.UrlDecode(data).Trim();
        }

        data = data.Replace("Trang trước", "").Replace("Trang sau", "");
        string text1 = "Ủng hộ vietjack.com";
        int p1 = data.IndexOf(text1);
        if (p1 != -1) data = data.Substring(p1 + text1.Length + 1, data.Length - (p1 + text1.Length + 1));

        // FOR EXERCISE
        string text2 = "Các bài tập Ngữ pháp tiếng Anh khác:";
        int p2 = data.IndexOf(text2);
        if (p2 != -1) data = data.Substring(0, p2);

        // FOR ARTICLE 
        //string text2 = "Các loạt bài khác:";
        //int p2 = data.IndexOf(text2);
        //if (p2 != -1) data = data.Substring(0, p2);

        data = data.Trim();
        string[] a = data.Split(new string[] { System.Environment.NewLine, "\n", "\r" }, System.StringSplitOptions.None);
        if (a[0].Length < 3)
        {
            title = a[1];
            data = data.Substring(a[0].Length, data.Length - a[0].Length).Trim();
        }
        else title = a[0];

        string file = ToAscii(title) + "-" + System.DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".txt";
        string path = Path.Combine(pathDir, file);
        File.WriteAllText(path, data);

        context.Response.Clear();
        context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
        context.Response.ContentType = "text/plain";
        context.Response.Write("SAVED => " + title);
        context.Response.Flush();
    }

    private static string ToAscii(string unicode)
    {
        if (string.IsNullOrEmpty(unicode)) return "";

        unicode = unicode.ToLower().Trim();

        unicode = Regex.Replace(unicode.Trim(), "[áàảãạăắằẳẵặâấầẩẫậ]", "a");
        unicode = Regex.Replace(unicode.Trim(), "[óòỏõọôồốổỗộơớờởỡợ]", "o");
        unicode = Regex.Replace(unicode.Trim(), "[éèẻẽẹêếềểễệ]", "e");
        unicode = Regex.Replace(unicode.Trim(), "[íìỉĩị]", "i");
        unicode = Regex.Replace(unicode.Trim(), "[úùủũụưứừửữự]", "u");
        unicode = Regex.Replace(unicode.Trim(), "[ýỳỷỹỵ]", "y");
        unicode = unicode.Trim().Replace("đ", "d").Replace("đ", "d");
        unicode = Regex.Replace(unicode.Trim(), "[-\\s+/]+", "-");
        unicode = Regex.Replace(unicode.Trim(), "\\W+", "-"); //Nếu bạn muốn thay dấu khoảng trắng thành dấu "_" hoặc dấu cách " " thì thay kí tự bạn muốn vào đấu "-"
        return unicode.ToLower().Trim();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}