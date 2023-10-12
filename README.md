# recipebook

To run the recipe book, download the source code from this repo using
```
git clone https://github.com/nicholas-callen/recipebook.git

OR install zip file directly
```
Next, install the necessary modules and start client:
```
cd (filepath)/recipebook
cd client
npm i
npm start
```
Follow the same steps in a new terminal window for server:
```
cd (filepath)/recipebook
cd server
npm i
```
Before running start, configure the .env file to allow access to MongoDB
```
touch .env
```
Using any text editor, add the following to the .env file:
```
MONGODB_URI=mongodb+srv://<credentials>@cookbook.o9zgwes.mongodb.net/?retryWrites=true&w=majority
```
Now launch server with
```
npm start
```

You should now have access to the recipebook, with client open at port 3000 and the server awaiting http requests at port 8000.
The application is read to be used.