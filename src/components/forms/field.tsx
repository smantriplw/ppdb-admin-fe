import React from 'react'

type FormFieldProps = React.PropsWithChildren<{
    label: string;
    labelKey?: string;
    viewUrl?: string;
    viewName?: string;
}>;

export const FormField = (props: FormFieldProps) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text text-[#08105B] text-opacity-70 text-xl font-semibold">
                    {props.label} {
                    props.viewUrl ? <>
                        (<a href={props.viewUrl.replace('public', 'storage')} target="_blank" className="text-blue-500 text-sm">{props.viewName ? props.viewName : 'click me to show'}</a>)
                        </> : null}
                </span>
            </label>
            {props.labelKey ? (
                <label className="input-group">
                    <span>{props.labelKey}</span>
                    {props.children}
                </label>
            ) : (
                <>
                    {props.children}
                </>
            )}
        </div>
    )
}