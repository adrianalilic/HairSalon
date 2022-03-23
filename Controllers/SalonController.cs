using System.Collections.Generic;
using System.Threading.Tasks;
using Projekat.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SalonController : ControllerBase
    {
        Context dbContext;
        public SalonController(Context context)
        {
            this.dbContext = context;
        }

        [HttpGet]
        [Route("Salons")]
        public async Task<JsonResult> getSalons()
        {
            var salons = await this.dbContext.Salons
            .Include(x => x.Reservations)
                .Include(x => x.Employers)
                .Include(x => x.Services)
                .AsSplitQuery().ToListAsync();
            return new JsonResult(salons);
        }
    }
}