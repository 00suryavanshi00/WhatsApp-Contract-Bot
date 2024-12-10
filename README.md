# Whatsapp-Contract-Bot
## Ideation
The idea is to implement not just a shabby looking code but a code which follows best practices from react and coding in general. So let's do this by thinking of the design patterns that can be implemented here.

1) Database Connection - Single Pattern ( To ensure only single connetion, global access )
2) Message Processing - Strategy Pattern ( Since they are two right now based on the contents of the message but if this needs to be extended then it can be easily without modifying the interface or parent level class) 
3) Message Handler - ( Probably a creational pattern like factory while keeping open/closed principle in mind or else if it's just one class then everytime I add a message processing strategy I'll have to edit the parent class which is never good and neither scalable)
4) Dashboard - Probably just custom hooks for api calls for now


## Tech Stack
NextJS and MongoDb

## Setup instructions

- Clone it from github git clone --repo link
- cd into the folder
- npm install
- npm run dev
- (postman or hopscotch for firing webshook apis)
- Once the server starts visit localhost:3000 to view the basic dashboard
- to hit the webhook api json payload - `{
  "phoneNumber": "+1234567890",
  "message": "Client name: John Snow. Contract amount: 1000"
} `
and url - `localhost:3000/api/webhook`
additionally if you want to skip local setup and directly use the api hit `https://whatsapp-6k6hh3uq9-sanskars-projects-e7b2c5c4.vercel.app/api/webhook` with the same json payload


## env variables
MONGODB_URI ( you can enter your own mongodb uri here I'll use my own in the deployed one)

Using vercel for deployment


Deployed link - `https://whatsapp-6k6hh3uq9-sanskars-projects-e7b2c5c4.vercel.app/`

