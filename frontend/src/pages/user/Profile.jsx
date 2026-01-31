import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
    const { user } = useSelector(state => state.user)

    return (
        <div className="row mt-4">
            <div className="col-md-4">
                <ul className="list-group">
                    <li className="list-group-item border border-dark border-3 mb-1">
                        <i className="bi bi-person"></i> { user?.name }
                    </li>
                    <li className="list-group-item border border-dark border-3">
                        <i className="bi bi-envelope"></i> { user?.email }
                    </li>
                </ul>
            </div>
        </div>
    )
}
