import NextAuth from "next-auth"
import { authoption } from "./option"


const handler=NextAuth(authoption)

export {handler as GET,handler as POST}