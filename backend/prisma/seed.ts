// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//     // Create Users
//     const users = await prisma.user.createMany({
//         data: [
//             { email: "john@example.com", name: "John Doe", password: "password123" },
//             { email: "jane@example.com", name: "Jane Doe", password: "password123" },
//             { email: "alice@example.com", name: "Alice", password: "password123" },
//             { email: "bob@example.com", name: "Bob", password: "password123" },
//         ],
//     });

//     console.log("Created Users:", users);

//     // Fetch users for creating relations and posts
//     const john = await prisma.user.findUnique({ where: { email: "john@example.com" } });
//     const jane = await prisma.user.findUnique({ where: { email: "jane@example.com" } });

//     // Create Posts
//     const posts = await prisma.post.createMany({
//         data: [
//             { title: "First Post", content: "This is my first post!", published: true, authorId: john!.id },
//             { title: "Second Post", content: "This is my second post!", published: true, authorId: john!.id },
//             { title: "Jane's Post", content: "Hi, I'm Jane!", published: false, authorId: jane!.id },
//         ],
//     });

//     console.log("Created Posts:", posts);

//     // Create Follow Relationships
//     const relations = await prisma.userRelation.createMany({
//         data: [
//             { followerId: john!.id, followingId: jane!.id },
//             { followerId: jane!.id, followingId: john!.id },
//         ],
//     });

//     console.log("Created User Relations:", relations);

//     // Update Counts
//     await prisma.user.update({
//         where: { id: john!.id },
//         data: { followingCount: 1, followersCount: 1 },
//     });

//     await prisma.user.update({
//         where: { id: jane!.id },
//         data: { followingCount: 1, followersCount: 1 },
//     });

//     console.log("Updated User Counts");
// }

// main()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
