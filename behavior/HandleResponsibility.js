// NEEDS WORK

class HandleResponsibility {
    constructor(agent, myIndex) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = agent;

        this.tree = builder
            .sequence("Handle Responsibility")
                .do("Do Work", (t) => {
		
                    let responsibility = me.Responsibility;
                    
                    //timeElapsed = 1.0f/(float)HospitalModel.get().getFPS();
                    let timeElapsed = 1 / 30;
                    
                    if(!responsibility.isStarted()) {
                        //HospitalModel.get().addComment(me, null, "Go " + responsibility.Name;
                        
                    }
                    
                    responsibility.doWork(timeElapsed);
                    
                    if(responsibility.isDone()) {
                        // these were commented out in the original v
                        
                        //me.removeResponsibility();
                        //HospitalModel.get().addComment(me, null, "Done " + responsibility.getName());
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
		
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
                })
            .end()
            .build();
    }

        async update(agentConstants, positions, msec) {
            await this.tree.tick({ agentConstants, positions, msec }) //Call the behavior tree
        }

}

export default HandleResponsibility;