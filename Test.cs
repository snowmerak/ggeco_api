using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using ggeco_api.Models;
using System.Linq;

namespace ggeco_api
{
    public class Test
    {
        private readonly blockContext context;

        public Test(blockContext _context)
        {
            context = _context;
        }

        [FunctionName("Test")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            var responseMessage = context.Badges.AsParallel().ToList();

            return new OkObjectResult(responseMessage);
        }
    }
}
