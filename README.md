# Whatsapp-Contract-Bot
## Ideation
The idea is to implement not just a shabby looking code but a code which follows best practices from react and coding in general. So let's do this by thinking of the design patterns that can be implemented here.

1) Database Connection - Single Pattern ( To ensure only single connetion, global access )
2) Message Processing - Strategy Pattern ( Since they are two right now based on the contents of the message but if this needs to be extended then it can be easily without modifying the interface or parent level class) 
3) Message Handler - ( Probably a creational pattern like factory while keeping open/closed principle in mind or else if it's just one class then everytime I add a message processing strategy I'll have to edit the parent class which is never good and neither scalable)
4) Dashboard - Probably just custom hooks for api calls for now
