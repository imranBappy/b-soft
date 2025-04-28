"use client"
import withProtection from "@/HOC/ProtectedRoute"
import { ADMIN } from "@/constants/role.constants"
import DescriptionForm from "../../components/forms/description-form"


function CardWithForm() {
    return (
        <div className=" flex p-5 items-center justify-center  ">
            <DescriptionForm />
        </div>
    )
}
export default withProtection(CardWithForm, [ADMIN])