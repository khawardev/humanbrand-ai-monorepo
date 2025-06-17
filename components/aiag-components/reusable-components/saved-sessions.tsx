import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark, FileText } from "lucide-react"
import { Button } from '@/components/ui/button'

const SavedSessions = () => {
  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant={'outline'} size={'icon'} >
                  <Bookmark />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-64" align="end">
              <DropdownMenuLabel className="flex gap-2 items-center min-w-0 ">
                  <div className=" flex flex-col" >
                      <span className="text-foreground truncate text-sm font-medium">
                          Saved Sessions
                      </span>
                      <span className="text-muted-foreground truncate text-xs font-normal">
                          Your previously saved content sessions.
                      </span>
                  </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                  <div className="flex items-center justify-between  w-full">
                      <div className="flex items-center space-x-2">
                          <FileText size={16} className="opacity-60" aria-hidden="true" />
                          <span>Social Media Post</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Now</span>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                          <FileText size={16} className="opacity-60" aria-hidden="true" />
                          <span>Member Email Draft</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                  <div className="flex items-center justify-between  w-full">
                      <div className="flex items-center space-x-2">
                          <FileText size={16} className="opacity-60" aria-hidden="true" />
                          <span>Press Release</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
              </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
  )
}

export default SavedSessions