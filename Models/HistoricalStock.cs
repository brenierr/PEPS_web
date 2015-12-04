using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PEPS.Models
{
    [Serializable]
    public class HistoricalStock
    {
        public HistoricalStock(DateTime date, double close)
        {
            this.Date = date;
            this.Close = close;
        }

        public DateTime Date { get; set; }
        public double Close { get; set; } 
    }
}