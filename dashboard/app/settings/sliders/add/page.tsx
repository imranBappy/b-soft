"use client"
import withProtection from "@/HOC/ProtectedRoute"
import { ADMIN } from "@/constants/role.constants"
import { SliderForm } from "../../components"


function CardWithForm() {
    return (
        <div className=" flex p-5 items-center justify-center  ">
            <SliderForm />
        </div>
    )
}
export default withProtection(CardWithForm, [ADMIN])