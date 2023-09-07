import { Box } from '@/components/ui/Box'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Box className="flex flex-col gap-4">
        <Heading>appcall</Heading>

        <Text className="max-w-2xl">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. A,
          obcaecati? Quo reprehenderit architecto suscipit in facere placeat
          ipsam? Nemo aliquid, repellendus eius commodi iste enim harum
          accusantium sapiente facere illo.
        </Text>
      </Box>
    </div>
  )
}
