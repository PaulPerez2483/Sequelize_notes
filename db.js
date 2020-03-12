const Sequelize = require("sequelize");
const { Op } = require("sequelize");

/*
for PC only
// connects to database
const db = new Sequelize('cars', 'testuser', 'test', {
    host: 'localhost', 
    dialect: 'postgres',
    logging:false
});
*/
//for MAC only
const db = new Sequelize(
	process.env.DATABASE_URL || "postgres://localhost/cars",
	{
		logging: false
	}
);
const { STRING, INTEGER, UUID, UUIDV4 } = Sequelize;
// to define a mapping between a model and a table, use the .define() method
/*
common data types :
STRING :: for shorter string 0 < 256 chars
BOOLEAN
DECIMAL
DATE
TEXT :: for longer strings
INTEGER
ARRAY(Sequelize.TEXT) :: an array of text strings (postgress only)

*/
const Maker = db.define("maker", {
	// product
	id: {
		primaryKey: true,
		type: UUID,
		defaultValue: UUIDV4
	},

	brand: {
		type: STRING,
		allowNull: false, // brand must have a value
		allowEmpty: false
	},

	suggestedPrice: {
		type: INTEGER,
		defaultValue: 5000, // instantiating will automatically set suggestedPrice to 0
		validate: {
			min: 5000,
			max: 50000
		}
		// validations need to be defined in the validate object
	},

	year: {
		type: INTEGER
	}
});

const Country = db.define("country", {
	// category
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4
	},
	name: {
		type: STRING,
		allowNull: false,
		unique: true,
		allowEmpty: false
	},
	continent: {
		type: STRING,
		allowNull: false,
		unique: true,
		allowEmpty: false
	}
});

// Setting Up Relationships - .belongsTo()
// making relations between models
//products belongs to country
Country.hasMany(Maker);
Maker.belongsTo(Country);
/* 
psql: 
\d makers : now has makerId

select brand from makers; :: show all of our makers

select * from makers :: show everything inside the table

select brand, id, "makerId" from products :: shows only the specified columns
*/
/* -------------- */

//Instance Methods : instance and class methods are common ways to add functionality to you Sequelize models
// instance methods are available on instances of the model.
// we ofter write these to get information or do something related to that instance

Country.prototype.Continent = function() {
	if (this.continent === "North America") {
		return "sales are great in this continent";
	}
	return `${this.continent}`;
};

Maker.prototype.howOld = function(discount) {
	return this.year <= 2014
		? `final Price ${this.suggestedPrice - discount}`
		: `sorry no discount`;
};

const syncAndSeed = async () => {
	await db.sync({ force: true });

	const [Usa, Italy, Japan] = await Promise.all([
		Country.create({ name: "United States", continent: "North America" }),
		Country.create({ name: "Italy", continent: "Europe" }),
		Country.create({ name: "Japan", continent: "Asia" })
	]);
	// calling an instance method :
	Usa.Continent();

	const [Ford, Jeep, Toyota, _Ford] = await Promise.all([
		Maker.create({
			brand: "Ford",
			suggestedPrice: 25000,
			year: 2019,
			countryId: Usa.id
		}),
		Maker.create({
			brand: "Jeep",
			suggestedPrice: 5000,
			year: 2014,
			countryId: Italy.id
		}),
		Maker.create({
			brand: "Toyota",
			suggestedPrice: 8000,
			year: 2006,
			countryId: Japan.id
		}),
		Maker.create({
			brand: "Ford",
			suggestedPrice: 10000,
			year: 2010,
			countryId: Usa.id
		})
	]);

	// calling instance methods
	// let f = Ford.howOld(3000);
	// let n = Jeep.howOld(1000);
	// console.log(f);
	// console.log(n);

	/*
    //Query Methods - these methods return promises
    .findAll() returns an array
    .findOne() returns one
    .findByPk() returns one
    .create() builds and saves the data

*/
	// find all brands
	const brands = await Maker.findAll();
	// console.log(brands);

	// find all car made in america
	const fordMakers = await Maker.findAll({
		where: { countryId: Usa.id }
	});
	// console.log(fordMakers);

	const fordMakerByPk = await Maker.findByPk(Ford.id);
	// console.log(fordMakerByPk);

	const Acura = await Maker.create({
		brand: "Acura",
		suggestedPrice: 35000,
		year: 2020
	});
	// console.log(Acura);

	const attr = await Maker.findAll({
		attributes: ["suggestedPrice"]
	});
	const isExpensive = attr.filter((price) => {
		let { suggestedPrice } = price.dataValues;
		if (suggestedPrice > 10000) {
			return true;
		}
	});

	const ten = await Maker.findAll({
		where: {
			suggestedPrice: { [Op.eq]: [10000] }
		}
	});
	// console.log(ten);
};

module.exports = {
	syncAndSeed,
	models: {
		Country,
		Maker
	}
};
