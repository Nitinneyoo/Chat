import { TableCell, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

export const SkeletonRow = () => {
    return (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
        </TableRow>
    );
};
