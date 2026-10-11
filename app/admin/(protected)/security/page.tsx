import PasskeyManager from '../../../../components/admin/PasskeyManager'

export default function SecurityPage() {
  return (
    <>
      <div className="admin-heading">
        <h1>Security</h1>
        <p>Manage passkeys and account security.</p>
      </div>

      <PasskeyManager />
    </>
  )
}
