import { View, Text, Touchable, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import Auth from "./auth"
import { supabase } from "../lib/supbase"
import AppTime from "./app"
import useUser from "../useUser"

export default function Index() {
  const { setUser, clearUser, user } = useUser()
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.identities?.[0]?.user_id) {
        const user = await supabase
          .from("UserPref")
          .select("*")
          .eq("id", session.user.identities[0].user_id)
        setUser(user)
      } else {
        clearUser()
      }
    })
  }, [])

  if (user) return <AppTime />
  else return <Auth />
}
