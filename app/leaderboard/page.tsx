import React from 'react'
import Leaderboard from '../components/Leaderboard'
import AuthGuard from '../components/AuthGuard'

const page = () => {
  return (
    <AuthGuard>
        <Leaderboard/>
    </AuthGuard>
  )
}

export default page
