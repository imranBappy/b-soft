"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Link from 'next/link';
import useAuth from "@/hooks/use-auth";
import { ME_QUERY } from "@/graphql/accounts/queries";
import { useQuery } from "@apollo/client";
function Profile() {
    const auth = useAuth();
    const { data } = useQuery(ME_QUERY, {});
    const {
        me: { name, photo },
    } = data || { me: { name: '', photo: '' } };



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                    <Avatar className="">
                        <AvatarImage src={photo} alt="Imran" />
                        <AvatarFallback className="bg-black text-white">
                            {name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        variant={'link'}
                        className="text-white font-playfair text-base hidden md:inline-block"
                    >
                        {name}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link className="w-full" href={'/customer/profile'}>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className="w-full" href={`/customer/orders`}>
                            Orders
                        </Link>
                    </DropdownMenuItem>
                    {
                        !auth?.isAuthenticated && (
                            <DropdownMenuItem  >
                                <Link className="w-full" href={`/shop`}>
                                    Shop
                                </Link>
                            </DropdownMenuItem>
                        )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => auth?.logout()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Profile