import { Salon } from "./salon.js";
import { Service } from "./service.js";
import { Reservation } from "./reservation.js";
import { Employer } from "./employer.js";

function loadSalon(parentDiv) {
    fetch("https://localhost:5001/Salon/Salons", {
    method:"GET",
    headers: {
        "Content-Type": "application/json",
    },
}).then((response) => 
        response.json().then((salonsFromResponse) => {
            salonsFromResponse.forEach((responseSalon) => {
                const salon = new Salon(responseSalon["name"], responseSalon["id"]);
                responseSalon["services"].forEach((service) => {
                    salon.addService(new Service(service["name"], service["id"]))
                });
                responseSalon["reservations"].forEach((reservation) => {
                    const jsDate = new Date(Date.parse(reservation["reservationDate"]));
                    salon.addReservation(new Reservation(jsDate,reservation["id"],reservation["service"], reservation["customer"], reservation["employer"]));
                });
                responseSalon["employers"].forEach((employer) => {
                    salon.addEmployer(new Employer(employer["name"], employer["lastName"], employer["id"]));
                });
                    
                salon.renderSalon(parentDiv);       
            });
        })
    );
} 

loadSalon(document.body); 

/*let service1 = new Service("hairstyling",1);
let service2 = new Service("coloring",2);
let service3 = new Service("haircut",3);
let service4 = new Service("balayage",4);
let employer1 = new Employer("Marija","Mitic",1);
let employer2 = new Employer("Ivana","Nikolic",2);
let employer3 = new Employer("Milica","Djordjevic",3);
let customer1 = new Customer("Milena","Spasic",1);
let customer2 = new Customer("Katarina","Tomic",2);
let reservation1 = new Reservation("24.3.2022. 18h", 1 ,service1, customer1);
let reservation2 = new Reservation("17.3.2022. 16h", 2, service2, customer2);
let salon1 = new Salon("HairDesign",1);
salon1.addService(service1);
salon1.addService(service2);
salon1.addService(service3);
salon1.addService(service4);
salon1.addEmployer(employer1);
salon1.addEmployer(employer2);
salon1.addEmployer(employer3);
salon1.addReservation(reservation1);
salon1.addReservation(reservation2);
salon1.renderSalon(document.body);

reservation1.render();
reservation2.render();

/*let salon2=new Salon("Peluquiera",2);
salon2.addService(new Service("hairstyling",1));
salon2.addService(new Service("coloring",2));
salon2.addService(new Service("haircut",3));
salon2.addService(new Service("balayage",4));
salon2.addEmployer(new Employer("Ana", "Mitic",1));
salon2.addEmployer(new Employer("Jovana","Nikolic",2));
salon2.addEmployer(new Employer("Tamara","Randjelovic",3));
salon2.addReservation(new Reservation("28.3.2022. 18h", 1 ,"?farbanje","?Snezana Jovanovic"));
salon2.addReservation(new Reservation("18.3.2022. 16h", 2, "?feniranje", "?Mina Ilic"));

salon2.crtaj();*/
