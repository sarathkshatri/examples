import ATransportResponsibility from "../support/responsibility/ATransportResponsibility.js";

class SetupTransport {
    constructor(agent, myIndex) {
        this.index = myIndex;
        let self = this;
        let me = agent;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Setup Transport")
                .do("Transport", (t) => {
                    // Computer computer = HospitalModel.get().computer;
                    let patient = me.CurrentPatient;

                    let responsibility = me.Responsibility;
                    if(!(this.responsibility instanceof ATransportResponsibility))
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    let transportResponsibility = responsibility;
                    //HospitalModel.get().addComment(me, patient, "Follow me");
                    me.Destination(transportResponsibility.Room.Location);
                    patient.Instructor(me);
                    patient.PatientTempState("FOLLOWING");

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agentConstants, positions, msec) {
        await this.tree.tick({ agentConstants, positions, msec }) //Call the behavior tree
    }

}

export default SetupTransport;