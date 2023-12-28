import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Copy, Download } from 'phosphor-react'
import QRCodeLink from 'qrcode'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

import { DashboardLayout } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { useToast } from '@/contexts/toast-context'

export default function ShareProfile() {
  const [qrCodeLink, setQrCodeLink] = useState('')

  const { showToast } = useToast()

  const session = useSession()
  const user = session.data?.user

  useEffect(() => {
    function handleGenerateQrCodeLink() {
      try {
        QRCodeLink.toDataURL(
          `appcall.com/schedule/${user?.username}`,
          {
            width: 600,
            margin: 3,
          },
          function (err, url) {
            if (err) {
              console.error('Error to generate QR code:', err)
            } else {
              setQrCodeLink(url)
            }
          },
        )
      } catch (error) {
        console.error('Erro undefined:', error)
      }
    }

    handleGenerateQrCodeLink()
  }, [user])

  return (
    <DashboardLayout
      headerTitle="📅 Compartilhar"
      heading="Compartilhe sua agenda."
      text="👇 Mostre o QR Code abaixo ou envie para seus amigos."
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-md border border-zinc-600 bg-violet-700 p-8">
          <div className="h-3 w-24 rounded-full bg-zinc-800"></div>
          <Image
            src={user?.avatar_url || ''}
            alt={user?.name || ''}
            width={80}
            height={80}
            className="mt-4 rounded-full"
          />

          <div className="flex flex-col gap-2">
            <Heading>{user?.name}</Heading>
            <Text>{user?.bio}</Text>
          </div>

          <div className="flex items-center justify-center rounded-md bg-zinc-50 p-4">
            <QRCode
              value={`appcall.com/schedule/${user?.username}`}
              size={196}
            />
          </div>

          <Button
            variant="link"
            className="flex items-center gap-2 transition-all hover:text-zinc-200"
            onClick={() => {
              navigator.clipboard.writeText(
                `appcall.com/schedule/${user?.username}`,
              )
              showToast('Copiado!', 'Link copiado com sucesso.', 'success')
            }}
          >
            <Copy />
            appcall.com/schedule/{user?.username}
          </Button>

          <a
            href={qrCodeLink}
            download="qrcode.png"
            className="flex items-center gap-2 transition-all hover:text-zinc-200"
          >
            <Download />
            Baixar QR Code
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
