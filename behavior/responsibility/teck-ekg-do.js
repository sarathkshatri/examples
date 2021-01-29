import ResponsibilitySubject from "./responsibility-subject.js"

import AResponsibility from "./aresponsibility.js"
import ACK from "./ACK.js"

class TechEKGDo extends AResponsibility {

	constructor(entry, medician) {
		super("Tech EKG Do", 1, entry, 4, ResponsibilitySubject.PATIENT, medician);
	}

	doFinish() {
		this.getEntry().setEkg("EKG Results");
		this.getEntry().addUnacknowledged(ACK.RESIDENT_EKG_READ);
		
	}
}

export default TechEKGDo;