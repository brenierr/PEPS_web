using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using System.IO;

namespace PEPS.Models
{
    public class ActigoHistoricalStock
    {
        public static List<HistoricalStock> EuroStoxx50 { get; set; }
        public static List<HistoricalStock> Sp500 { get; set; }
        public static List<HistoricalStock> SpAsx200 { get; set; }
        public DateTime StartDate { get; set; }

        public ActigoHistoricalStock(DateTime startDate)
        {
            this.StartDate = startDate;
            EuroStoxx50 = HistoricalStockDownloader.DownloadData(startDate, "^STOXX50E", 2014); // EURO STOXX 50
            Sp500 = HistoricalStockDownloader.DownloadData(startDate, "^GSPC", 2014); // S&P 500
            SpAsx200 = HistoricalStockDownloader.DownloadData(startDate, "^AXJO", 2014); // SP ASX 200
            matchDatesForHistoricalStocks(EuroStoxx50, Sp500);
            matchDatesForHistoricalStocks(SpAsx200, Sp500);
            matchDatesForHistoricalStocks(EuroStoxx50, SpAsx200);
            //saveActigoHistoricalStocks("EuroStoxx", "Sp500", "SpAsx200");
        }

        /**
         * recquire : the two list are fill with historical stock, beginning at the same date
         * For missing days we put the value of the day before
         */
        public void matchDatesForHistoricalStocks(List<HistoricalStock> list1, List<HistoricalStock> list2)
        {
            if (list1[0].Date != list2[0].Date)
            {
                throw new InvalidOperationException();
            }
            int i = 0, j = 0;
            while (i < list1.Count && j < list2.Count)
            {
                if (list1[i].Date < list2[j].Date)
                {
                    // insert the missing date, with the value of the stock the day before
                    list2.Insert(j, new HistoricalStock(list1[j].Date, list2[j-1].Close));
                }
                else if (list1[i].Date > list2[j].Date)
                {
                    // insert the missing date, with the value of the stock the day before
                    list1.Insert(i, new HistoricalStock(list2[j].Date, list1[i-1].Close));
                }
                    i++;
                    j++;
            }
        }

        public void saveActigoHistoricalStocks(string filename1, string filename2, string filename3)
        {
            FileStream file1 = File.Open(filename1, FileMode.OpenOrCreate);
            FileStream file2 = File.Open(filename2, FileMode.OpenOrCreate);
            FileStream file3 = File.Open(filename3, FileMode.OpenOrCreate);
            XmlSerializer serializer = new XmlSerializer(typeof(List<HistoricalStock>));
            serializer.Serialize(file1, EuroStoxx50);
            serializer.Serialize(file2, Sp500);
            serializer.Serialize(file3, SpAsx200);
            file1.Close();
            file2.Close();
            file3.Close();
        }

        public void loadActigoHistoricalStocks(string filename1, string filename2, string filename3)
        {
            FileStream file1 = File.Open(filename1, FileMode.OpenOrCreate);
            FileStream file2 = File.Open(filename2, FileMode.OpenOrCreate);
            FileStream file3 = File.Open(filename3, FileMode.OpenOrCreate);
            XmlSerializer serializer = new XmlSerializer(typeof(List<HistoricalStock>));
            EuroStoxx50 = ((List<HistoricalStock>)serializer.Deserialize(file1));
            Sp500 = ((List<HistoricalStock>)serializer.Deserialize(file2));
            SpAsx200 = ((List<HistoricalStock>)serializer.Deserialize(file3));
            file1.Close();
            file2.Close();
            file3.Close();
        }
    }
}