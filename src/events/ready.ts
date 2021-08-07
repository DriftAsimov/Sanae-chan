import { Sanae } from "../core/bot";

export default class Ready
{
    constructor(private client: Sanae) {}

    public run = () => 
    {
        console.log("Yay I am ready!")
        this.client?.user?.setPresence({ activities: [{ name: "with your problems" }], status: 'online' })
    }
}