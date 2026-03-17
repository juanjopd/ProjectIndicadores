import User  from "../models/User.js";

export const createUser = async(req, res) => {
	try {
		const user = await User.create(req.body);
		return res.status(201).json(user);
	} catch(error){
		return res.status(500).json({ message: error.message });	
	}
};

export const getUsers = async(req, res) => {
	try {
		const users = await User.findAll();
		return res.json(users);
	} catch (error){
		return res.status(500).json({ message: error.message });
	}
};

