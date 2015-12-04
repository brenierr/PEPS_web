using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PEPS.Models;

namespace PEPS.Controllers
{
    public class HistoricalStockController : Controller
    {
        // GET: HistoricalStock
        public ActionResult Index()
        {
            //
            return View("Index", "");
        }

        public JsonResult GetHistoricalStock()
        {
            ActigoHistoricalStock actigo = new ActigoHistoricalStock(new DateTime(2014, 12, 12));
            return Json(ActigoHistoricalStock.EuroStoxx50, JsonRequestBehavior.AllowGet);
        }
    }
}
