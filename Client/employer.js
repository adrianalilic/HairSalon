export class Employer {
    constructor(name, lastName, id)
    {
        this.name = name != null ? name : "N";
        this.lastName= lastName != null ? lastName : "N";
        this.id = id;
    }
}