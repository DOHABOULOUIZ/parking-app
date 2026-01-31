import React from 'react'

export default function useValidation(errors, field) {

    const renderErrors = () => (
        errors?.[field]?.map((error, index) => (
            <div key={index} className="fw-bold text-danger">
                { error }
            </div>
        ))
    )

    return renderErrors()
}
