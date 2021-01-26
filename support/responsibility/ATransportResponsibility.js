import AResponsibility from "./AResponsibility.js";

class ATransportResponsibility extends AResponsibility {
    room; //IRoom

    constructor(name, entry, medician, location) { //String, ComputerEntry, IMedician, IRoom
        super(name, 1, entry, 4, "PATIENT", medician);
        this.room = location;
    }

    get Room() {
        return this.room;
    }

    set Room(room)
    {
        this.room = room;
    }

    doWork(amount)
    {
        if(!this.calledStarted) {
            this.calledStarted = true;
            start();
        }

        let distance = entry.Patient.Location.distanceTo(room.Location);

        if(distance < 1 && !calledFinished) {
            calledFinished = true;
            this.Medician.CurrentPatient(null);
            entry.Patient.PatientTempState("GO_INTO_ROOM");
            entry.Patient.AssignedRoom(room);
            finish();
            this.remaining = 0;
        }

    }

    doFinish() {

    }

    doStart() {
        
    }


}

export default ATransportResponsibility;