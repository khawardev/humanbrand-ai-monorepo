
const WhatsNew = () => {
  return (
      <div className="p-1 group-data-[collapsible=icon]:hidden">
          <div className="bg-accent border  rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center gap-2  font-medium">
                  <div className="size-2 rounded-full  bg-foreground " />
                  <span>What's New</span>
                  <span className="ml-auto text-[10px] bg-border px-1 rounded-sm ">11</span>
              </div>
              <p className="text-muted-foreground line-clamp-2">View our latest update</p>
          </div>
      </div>
  )
}

export default WhatsNew