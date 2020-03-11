const Sequelize = require('sequelize');

// connects to database
const db = new Sequelize('cars', 'testuser', 'test', {
    host: 'localhost', 
    dialect: 'postgres',
    logging:false
});

const {STRING, INTEGER, UUID, UUIDV4} = Sequelize;

const Maker = db.define('honda', {
        id:{
            primaryKey: true,
            type: UUID,
            defaultValue: UUIDV4
        },

        brand:{
            type: STRING,
            allowNull: false,
            allowEmpty: false
        },

        suggestedPrice: {
            type: INTEGER
        },

        year: {
            type: INTEGER
        }
});

const Country = db.define('country', {
    id:{
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type:STRING,
        allowNull: false,
        unique: true,
        allowEmpty: false
    },
    continent: {
        type: STRING,
        allowNull: false,
        unique:true,
        allowEmpty: false
    }
});

// Setting Up Relationships - .belongsTo()
Country.hasMany(Maker);
Maker.belongsTo(Country);

/* 
psql: 

\d makers : now has makerId

select brand from makers; :: show all of our makers

select * from makers :: show everything inside the table

select brand, id, "makerId" from products :: shows only the specified columns

*/
const syncAndSeed = async() => {
    await db.sync({ force: true });

    const CarMakers = [
        {brand: 'Ford', suggestedPrice: 25000, year:2019},
        {brand: 'Jeep', suggestedPrice: 15000, year:2014},
        {brand: 'Toyota', suggestedPrice: 8000, year:2006},
        {brand: 'Ford', suggestedPrice: 10000, year:2010},
    ];

    const [Ford, Nissan, Toyota, _Ford] = await Promise.all(CarMakers.map(maker => Maker.create(maker)));

    const Countries = [
        {name:"United States", continent:"North America"},
        {name:"Italy", continent:"Europe" },
        {name:"Japan", continent: "Asia"}
    ];

    const [Usa, Italy, Japan] = await Promise.all(Countries.map(country => Country.create(country)));
    console.log(Ford)
    await Promise.all([
       Usa.update({countryId: Ford.id}) 
    ])
    // Maker.findAll().then(data => console.log(data[0]))

    // Country.findAll().then(data => console.log(data));
}

syncAndSeed();