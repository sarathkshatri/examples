class Reassess {
    constructor(agent, myIndex) {
        this.index = myIndex;
        let self = this;
        let me = agent;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Reassess")
                .do("Reassess", (t) => {
                    // Computer computer = HospitalModel.get().computer;
                    let patient = me.CurrentPatient;

                    //let entry = computer.Entry(patient);

                    let responsibility = null;
                    if(entry != null)
                        // responsibility = ResponsibilityFactory.get(me.getMedicianSubclass()).get(entry, me);
                    if(entry == null || responsibility == null) {
                        me.CurrentPatient(null);
                        return fluentBehaviorTree.BehaviorTreeStatus.Failure
                    }
                    else {
                        me.CurrentPatient(patient);

                        me.Responsibility(responsibility);
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agentConstants, positions, msec) {
        await this.tree.tick({ agentConstants, positions, msec }) //Call the behavior tree
    }

}

export default Reassess;