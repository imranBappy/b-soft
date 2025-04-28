"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"




interface FilterProps {
    name: string;
    items: {
        value: string,
        label: string
    }[]
}

const SelectFilter = ({ name, items }: FilterProps) => {


    return (
        <Card className=" w-72  rounded">
            <CardHeader className="px-4 py-4 dark:bg-primary-foreground   bg-gray-light  text-primary-background">
                <CardTitle className=" font-playfair font-bold text-base" >{name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <ScrollArea className="h-72  w-full ">
                    <div className="p-4 pt-2">
                        {items.map((items) => (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={items.value} />
                                    <label
                                        htmlFor={items.value}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {items.label}
                                    </label>
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default SelectFilter;