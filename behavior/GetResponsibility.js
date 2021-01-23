// NEEDS WORK
import Hospital from "../support/Hospital.js"
import ResponsibilityFactory from "../support/responsibility/ResponsibilityFactory.js"


class GetResponsibility {
    constructor(myIndex, agentConstants, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = () => agentConstants.find(a => a.id == myIndex);;

        this.tree = builder
            .sequence("Get Responsibility")
            .do("Check Responsibilities", (t) => {

                let responsibility = Hospital.computer.entries.filter(
                    i => me().hasRoom(i.Bed) &&
                        this.getResponsibilityFactory(me().MedicianSubclass).get(i, me()) != null
                )
                    .map(i => this.getResponsibilityFactory(me().MedicianSubclass).get(i, me()))
                    .reduce((a, b) => a == null ? null : b == null ? a : a.getPriority() < b.getPriority() ? a : b)



                if (responsibility == null) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                }

                //HospitalModel.get().addComment(me, null, "!! " + responsibility.getName());

                me().Responsibility = responsibility;

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }
    getResponsibilityFactory(medicianSubclass) {
        return ResponsibilityFactory.get(medicianSubclass);
    }
}

export default GetResponsibility;