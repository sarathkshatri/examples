class WaitForResponsibilityPatient {
    constructor(agent, myIndex) {
        //this.agent = agent;
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let me = agent;

        this.tree = builder
            .sequence("Wait For Patient")
                .do("Wait", (t) => {
                    
                    let responsibility = me.Responsibility;
                    let patient = me.CurrentPatient;

                    if(me.Responsibility.Subject == "COMPUTER")
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;

                    let patientLocation = patient.Location;

                    let distance = me.Location.distanceTo(patientLocation);
                    if(distance < 1)
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;

                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .end()
            .build();
    }
    async update(agent, agentConstants, frame, msec) {
        await this.tree.tick({ agentConstants, frame, msec }) //Call the behavior tree
    }

}

export default WaitForResponsibilityPatient;