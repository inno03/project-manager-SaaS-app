export const getProjects = async (prisma, user_id) => {
  const projects = await prisma.project.findMany({
    where: {
      owner: {
        id: user_id,
      },
    },
    include: {
      todos: {
        orderBy: {
          id: 'desc',
        },
      },
    },
  })

  return projects
}