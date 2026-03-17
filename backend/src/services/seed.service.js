import bcrypt from "bcryptjs";
import User  from "../models/User.js";
import Role  from "../models/Role.js";

export const runSeed = async () =>  {
	try {

	 // crear roles
    const [superadminRole] = await Role.findOrCreate({
      where: { name: "superadmin" }
    });	
		
	 const [entityRole] = await Role.findOrCreate({
      where: { name: "entity" }
    });

    // verificar si ya existe el superadmin
    const adminExists = await User.findOne({
      where: { email: "admin@admin.com" }
    });

    if (adminExists) {
      console.log("✅ Superadmin ya existe");
      return;
    }

 	const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      roleId: superadminRole.id
    });

    console.log("🔥 Superadmin creado");
    //console.log("email: admin@admin.com");
    //console.log("password: admin123");
		
		
	} catch (error) {
		console.error("Error en seed:", error);	
	}
};
