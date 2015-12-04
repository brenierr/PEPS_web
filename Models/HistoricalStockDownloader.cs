using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Globalization;

namespace PEPS.Models
{
    public static class HistoricalStockDownloader
    {
        public static List<HistoricalStock> DownloadData(DateTime startDate, string ticker, int yearToStartFrom)
        {
            List<HistoricalStock> retval = new List<HistoricalStock>();
            using (WebClient web = new WebClient())
            {
                string data = web.DownloadString(string.Format("http://ichart.finance.yahoo.com/table.csv?s={0}&c={1}", ticker, yearToStartFrom));
                data = data.Replace("r", "");

                string[] rows = Regex.Split(data, @"\n");

                //First row is headers so Ignore it
                for (int i = 1; i < rows.Length; i++)
                {
                    if (rows[i].Replace("n", "").Trim() == "") continue;

                    string[] cols = rows[i].Split(',');

                    string[] date = cols[0].Split('-');
                    DateTime dateTime = new DateTime(Convert.ToInt32(date[0]), Convert.ToInt32(date[1]), Convert.ToInt32(date[2]));
                    if (dateTime >= startDate)
                    {
                        HistoricalStock hs = new HistoricalStock(dateTime,
                            Convert.ToDouble(cols[4].Replace('.', ',')));
                        retval.Insert(0, hs); // insert in first position to have date in a chronological order
                    }
                }
                return retval;
            }
        }
    }
}