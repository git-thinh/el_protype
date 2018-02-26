<%@ WebHandler Language="C#" Class="tree" %>

using System.IO;
using System.Web;
using System.Text;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class tree : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string data = "";
        string id = context.Request.QueryString["id"];
        if (string.IsNullOrEmpty(id)) id = "#";
        if (id.EndsWith(".txt"))
        {
            string file = id.Replace('|', '\\');
            if (File.Exists(file))
                data = File.ReadAllText(file);

            if (file.EndsWith("phrase-popular.txt"))
                data = formatPhrasePopular(data);

            context.Response.Clear();
            context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            context.Response.ContentType = "text; charset=utf-8";
            context.Response.Write(data);
            context.Response.Flush();
        }
        else
        {
            string path = "", icon = @",""parent"":""#"",""icon"":""fa fa-folder-open-o"",";
            string slevel = context.Request.QueryString["level"];
            int level = 0;
            int.TryParse(slevel, out level);
            if (string.IsNullOrEmpty(id) || id == "#")
            {
                id = "";
                string pathDir = HttpContext.Current.Server.MapPath("~/data/");
                path = Path.Combine(pathDir, id);
                icon = @",""parent"":""" + id + @""",""icon"":""fa fa-university"",";
            }
            else
            {
                path = id.Replace('|', '\\');
                level++;
                string fa = "fa fa-book";
                if (level > 1) fa = "fa fa-folder-open-o";
                icon = @",""parent"":""" + Path.GetFileName(path) + @""",""icon"":""" + fa + @""",";
            }

            //// Directory
            string cat = "", keyPath = path.Replace('\\', '|');
            if (!keyPath.EndsWith("|")) keyPath += "|";
            List<string> ld = new List<string>();
            string[] fd = Directory.GetDirectories(path);
            for (int i = 0; i < fd.Length; i++)
            {
                fd[i] = Path.GetFileName(fd[i]);
                if (fd[i][0] != '-') ld.Add(fd[i]);
            }

            if (ld.Count > 0)
                cat = @"{""children"": true,""type"": ""category"",""level"": " + level.ToString() + @",""path"": """ + keyPath + @"""" + icon + @"""text"": """ +
                        string.Join(@"""},{""children"": true,""type"": ""category"",""level"": " + level.ToString() + @",""path"": """ + keyPath + @"""" + icon + @"""text"": """, ld.ToArray()) + @"""}";

            // File
            string items = "", iconItem = @",""parent"":""" + id + @""",""icon"":""fa fa-file-o"",";
            List<string> lf = new List<string>();
            string[] fs = Directory.GetFiles(path, "*.txt");

            for (int i = 0; i < fs.Length; i++)
            {
                string title = File.ReadAllText(fs[i]).Trim().Split(new string[] { System.Environment.NewLine, "\n", "\r" }, System.StringSplitOptions.None)[0].Trim();
                if (string.IsNullOrEmpty(title)) continue;

                fs[i] = Path.GetFileName(fs[i]);
                if (fs[i][0] != '-') lf.Add(fs[i]);
                if (items == "")
                    items = @"{""children"": false,""type"": ""item"",""level"": " + level.ToString() + @",""path"": """ + keyPath + @""",""key"": """ + fs[i] + @"""" + iconItem + @"""text"": """ + title + @"""}";
                else
                    items += @",{""children"": false,""type"": ""item"",""level"": " + level.ToString() + @",""path"": """ + keyPath + @""",""key"": """ + fs[i] + @"""" + iconItem + @"""text"": """ + title + @"""}";
            }

            data = cat + (items == "" ? "" : ",") + items;
            if (data.StartsWith(",")) data = data.Substring(1);
            data = "[" + data + "]";

            context.Response.Clear();
            context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.Write(data);
            context.Response.Flush();
        }
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

    private string formatPhrasePopular(string data)
    {
        data = data.Replace('‘', '’').Replace('–', '-').Replace("…", "|||").Replace("...", "|||");
        data = Regex.Replace(data, "Cấu trúc", string.Empty, RegexOptions.IgnoreCase);
        data = data.Replace(" : ", ": ");
        data = data.Trim();

        List<string> HEAD = new List<string>();
        HEAD.AddRange(new string[] { "* ", "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H." });

        string[] a = data.Split(new string[] { System.Environment.NewLine, "\n", "\t" }, System.StringSplitOptions.None);

        List<string> ls = new List<string>();
        for (int i = 1; i < a.Length; i++)
        {
            string si = a[i].Trim();
            if (si == "") continue;
            char lang = 'e';
            if (si.Length != Regex.Replace(si, @"[^\u0000-\u007F]", string.Empty).Length) lang = 'v';

            if (si.Contains("có thể dùng enough m"))
                data = "";

            if (si.Length > 2 && lang == 'e' && HEAD.IndexOf(new string(new char[] { si[0], si[1] })) != -1)
            {
                ls.Add("# " + si.Substring(2).Replace("|||", "...").Trim());
                continue;
            }

            /* [1] lang is vi + contain char . => split */
            if (lang == 'v' && (si.IndexOf('.') != -1 && si.IndexOf(':') == -1))
            {
                si = si.Replace("|||", "...");
                string[] ai = si.Split('.');
                string phrase = ai[0].Trim();
                int pos = si.IndexOf(phrase);
                string mean = si.Substring(ai[0].Length + 1, si.Length - (ai[0].Length + 1)).Trim();
                /* phrase is vi */
                if (phrase.Length != Regex.Replace(phrase, @"[^\u0000-\u007F]", string.Empty).Length)
                {
                    if (si[0] == '-' || si[0] == '+') si = si.Substring(1).Trim();
                    if (lang == 'e') si = "+ " + si;
                    else si = "- " + si;
                    ls.Add(si);
                }
                else
                {
                    /* phrase is en */
                    if (phrase != "")
                    {
                        if (phrase[0] == '-' || phrase[0] == '+') phrase = phrase.Substring(1).Trim();
                        phrase = "+ " + phrase;
                        ls.Add(phrase);
                    }

                    if (mean != "")
                    {
                        if (mean[0] == '-' || mean[0] == '+') mean = mean.Substring(1).Trim();
                        mean = "- " + mean;
                        ls.Add(mean);
                    }
                }
                continue;
            }

            /* [2] lang is vi + contain : => is HEAD */
            if (lang == 'v' && si.IndexOf(':') != -1)
            {
                string[] ai = si.Split(':');
                string mean = ai[ai.Length - 1].Trim();
                string phrase = si.Substring(0, si.IndexOf(mean)).Trim();
                /* phrase is vi */
                if (phrase == "" || phrase.Length != Regex.Replace(phrase, @"[^\u0000-\u007F]", string.Empty).Length)
                {
                    si = si.Replace("|||", "...");
                    if (si[0] == '-' || si[0] == '+') si = si.Substring(1).Trim();
                    si = "- " + si;
                    ls.Add(si);
                }
                else
                {
                    /* phrase is en */
                    mean = mean.Replace("|||", "...");
                    phrase = phrase.Replace("|||", "...");

                    if (phrase[0] != '#') phrase = "# " + phrase;
                    phrase = phrase
                        .Replace("# *", "#").Replace("#*", "#")
                        .Replace(" sth ", " something ").Replace(" sth:", " something ").Replace(" sth)", " something)")
                        .Replace(" sb ", " somebody ").Replace(" sb:", " somebody ").Replace(" sb)", " sb)");
                    ls.Add(phrase);
                    if (mean != "") ls.Add("= " + mean);
                }
            }
            else
            {
                /* item has not contain : */
                si = si.Replace("|||", "...");
                if (si.StartsWith("(") && si.EndsWith(")")) si = si.Substring(1, si.Length - 2).Trim();
                if (si[0] == '-' || si[0] == '+') si = si.Substring(1).Trim();
                if (lang == 'e') si = "+ " + si;
                else si = "- " + si;
                ls.Add(si);
            }
        }

        for (int i = 0; i < ls.Count; i++)
            if (ls[i].Length > 2) ls[i] = (ls[i][0] == '#' ? System.Environment.NewLine + System.Environment.NewLine : "") + ls[i][0] + " " + ls[i][2].ToString().ToUpper() + ls[i].Substring(3);



        string rs = a[0][0].ToString().ToUpper() + a[0].Substring(1) +
            System.Environment.NewLine + System.Environment.NewLine +
            string.Join(System.Environment.NewLine, ls.ToArray());
        return rs;
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}