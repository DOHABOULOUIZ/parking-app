import React from 'react'
import { ClipLoader } from "react-spinners"

export default function Spinner() {
    return (
        <div className="d-flex justify-content-center">
            <ClipLoader
                size={80}
            />
        </div>
    )
}
