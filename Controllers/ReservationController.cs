using System.Collections.Generic;
using System.Threading.Tasks;
using Projekat.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;
 

namespace Projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationController : ControllerBase
    {
        Context dbContext;
        public ReservationController(Context context)
        {
            this.dbContext = context;
        }

        [HttpGet]
        [Route("Reservations")]
        public async Task<JsonResult> getReservations()
        {
            var reservations = await this.dbContext.Reservations.ToListAsync();
            return new JsonResult(reservations);
        }

        [HttpPost]
        [Route("CreateReservation/SalonId={salonId}")]
        public async Task<Reservation> CreateReservation(int salonId, [FromBody] Reservation reservation)
        {

            var salon = await this.dbContext.Salons.FindAsync(salonId);
            var employer = await this.dbContext.Employers.FindAsync(reservation.Employer.Id);
            var service = await this.dbContext.Services.FindAsync(reservation.Service.Id);
            if (salon != null && employer != null && service != null) {
                reservation.Salon = salon;
                reservation.Employer = employer;
                reservation.Service = service;
                this.dbContext.Reservations.Add(reservation);
                await this.dbContext.SaveChangesAsync();
                return reservation;
            }
            else {
                throw new System.Exception("Ne postoji salon sa datim id-jem.");
            }

        }

        [HttpPut]
        [Route("EditReservation/ReservationId={id}")]
        public async Task<Reservation> updateReservation(int id, [FromBody] Service service)
        {
            var reservation = await this.dbContext.Reservations.Include(x => x.Employer).FirstOrDefaultAsync(i => i.Id == id);
            if (reservation != null && service != null) {
                reservation.Service = service;
                this.dbContext.Reservations.Update(reservation);
                await this.dbContext.SaveChangesAsync();
                return reservation;
            }
            else {
                throw new System.Exception("Id of reservation or service is not defined! ");
            }
        }

        [HttpDelete]
        [Route("DeleteReservation/ReservationId={id}")]
        public async Task DeleteReservation(int id)
        {
            Reservation reservation = await this.dbContext.Reservations.FindAsync(id);
            if (reservation != null) {
                this.dbContext.Reservations.Remove(reservation);
                await this.dbContext.SaveChangesAsync();
            } else {
                throw new System.Exception("Reservation with this id does not exist! ");
            }
        }


    }
}